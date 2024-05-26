import { ActivatedRoute } from "@angular/router";

export const getParamFromRoute = (route: ActivatedRoute, param: string = 'id'): number =>
  +(route.snapshot.paramMap.get(param) ?? 0)
