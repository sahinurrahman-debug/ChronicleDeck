from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.deps import CurrentUser, Session
from app.models import AppUser
from app.schemas.auth import Credentials, TokenOut, UserOut
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
async def register(payload: Credentials, session: Session) -> TokenOut:
    email = payload.email.lower()
    if await session.scalar(select(AppUser.id).where(AppUser.email == email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    user = AppUser(email=email, password_hash=hash_password(payload.password))
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return TokenOut(access_token=create_access_token(user.id))


@router.post("/login", response_model=TokenOut)
async def login(payload: Credentials, session: Session) -> TokenOut:
    user = await session.scalar(select(AppUser).where(AppUser.email == payload.email.lower()))
    if user is None or not user.password_hash or not verify_password(
        payload.password, user.password_hash
    ):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    return TokenOut(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser) -> AppUser:
    return user
