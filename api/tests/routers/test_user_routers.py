import pytest


@pytest.mark.asyncio
async def test_user_info(auth_http_client):
    response = await auth_http_client.get("/user/info")
    assert response.status_code == 200

    user_data = response.json()

    assert user_data
    assert 'user_id' in user_data
    assert 'username' in user_data
    assert 'created_at' in user_data