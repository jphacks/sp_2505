from pydantic import BaseModel


class RouteRequest(BaseModel):
  lat: float
  lon: float
  distance: float|None
  time: float|None
  preference: str
