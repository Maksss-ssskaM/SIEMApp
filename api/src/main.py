import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from routers import incidents_router, events_router, auth_router, user_router
from websocket_manager import create_websocket_endpoint

app = FastAPI()

origins = [
    "http://localhost",
    "https://localhost",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(incidents_router)
app.include_router(events_router)
app.include_router(auth_router)
app.include_router(user_router)

app.websocket("/ws/submit-new-incidents")(create_websocket_endpoint("new_incidents"))


@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")


if __name__ == '__main__':
    uvicorn.run('main:app', port=8080, reload=True)
