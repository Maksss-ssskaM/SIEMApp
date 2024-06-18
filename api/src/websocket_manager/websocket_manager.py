from typing import List, Dict
from starlette.websockets import WebSocket, WebSocketState, WebSocketDisconnect

active_websockets: Dict[str, List[WebSocket]] = {
    "new_incidents": [],
}


def create_websocket_endpoint(category: str):
    async def websocket_endpoint(websocket: WebSocket):
        if category not in active_websockets:
            if websocket.client_state == WebSocketState.CONNECTED:
                await websocket.close(code=4000, reason="Неверная категория")
            return

        await websocket.accept()
        active_websockets[category].append(websocket)
        try:
            while True:
                data = await websocket.receive_text()
                await websocket.send_text(f"{category.capitalize()}: {data}")
        except Exception as e:
            if not isinstance(e, WebSocketDisconnect):
                print(f"Ошибка веб-сокета: {e}")
        finally:
            active_websockets[category].remove(websocket)
            if websocket.client_state == WebSocketState.CONNECTED:
                await websocket.close()

    return websocket_endpoint


async def send_to_websockets(data, category: str):
    if category not in active_websockets:
        print(f"Для категории не найдено активных веб-сокетов: {category}")
        return

    websockets = active_websockets[category]
    for websocket in websockets:
        if websocket.client_state == WebSocketState.CONNECTED:
            try:
                await websocket.send_json(data)
            except RuntimeError:
                continue
        else:
            websockets.remove(websocket)
            print(f"WebSocket не подключен: {websocket}")