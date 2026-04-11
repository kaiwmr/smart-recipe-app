from crud import create_invite_code

async def test_full_auth_flow(client, db_session):

    create_invite_code(db_session, "VIP2026")

    user_data = {
        "email": "test@test.de",
        "password": "safe",
        "invite_code": "VIP2026"
    }

    reg_resp = await client.post("/users/", json=user_data)
    assert reg_resp.status_code == 200

    login_data = {
        "username": "test@test.de",
        "password": "safe"
    }

    login_resp = await client.post("/token", data=login_data)

    assert login_resp.status_code == 200
    assert login_resp.json() == {"message": "Login successful"}
    assert "access_token" in login_resp.cookies