import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { concatMap, from, last, takeWhile } from "rxjs";
import { IAsyncGuard } from "../../interfaces/Application/IAsyncGuard";


export function orderedAsyncGuards(
  guards: Array<new () => IAsyncGuard>
): CanActivateFn {
  return (route, state) => {
    const guardInstances = guards.map(guard => inject(guard)) as IAsyncGuard[];

    return from(guardInstances).pipe(
      concatMap((guard) => guard.canActivate(route, state)),
      takeWhile((value) => value === true, /* inclusive */ true),
      last()
    );
  };
}
