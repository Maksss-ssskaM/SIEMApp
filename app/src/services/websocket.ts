class WebSocketManager {
    private socket: WebSocket | null = null;

    constructor(private url: string, private messageHandler: (event: MessageEvent) => void) {}

    connect() {
        this.socket = new WebSocket(this.url);
        this.socket.onmessage = this.messageHandler;
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export const createWebSocketConnection = (url: string, messageHandler: (event: MessageEvent) => void) => {
    const webSocketManager = new WebSocketManager(url, messageHandler);
    webSocketManager.connect();
    return webSocketManager;
};
