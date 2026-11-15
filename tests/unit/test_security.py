import uuid

from app.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from hypothesis import given
from hypothesis import strategies as st


def test_password_roundtrip() -> None:
    stored = hash_password("correct horse battery")
    assert verify_password("correct horse battery", stored)
    assert not verify_password("wrong", stored)


def test_hashes_are_salted() -> None:
    assert hash_password("same") != hash_password("same")


def test_malformed_hash_never_verifies() -> None:
    assert not verify_password("x", "garbage")
    assert not verify_password("x", "bcrypt$a$b")


@given(st.uuids())
def test_token_roundtrip(user_id: uuid.UUID) -> None:
    assert decode_access_token(create_access_token(user_id)) == user_id


def test_garbage_token_decodes_to_none() -> None:
    assert decode_access_token("a.b.c") is None
