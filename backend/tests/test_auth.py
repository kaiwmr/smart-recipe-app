from crud import create_invite_code

async def test_full_auth_flow(client, db_session):

    # 1. Invite Code in Test-DB anlegen
    create_invite_code(db_session, "VIP2026")

    # 2. Registrierung
    user_data = {
        "email": "test@test.de",
        "password": "safe",
        "invite_code": "VIP2026"
    }

    reg_resp = await client.post("/users/", json=user_data)
    assert reg_resp.status_code == 200

    # 3. Login
    login_data = {
        "username": "test@test.de",
        "password": "safe"
    }

    login_resp = await client.post("/token", data=login_data)
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()