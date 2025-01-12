import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { map, Observable, take } from "rxjs";
import { IStats } from "../interfaces/Stats/IStats";
import { Timelines } from "../enums/Timelines";
import { IStatsItemRequest } from "../interfaces/Stats/IStatsItemRequest";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(
    private _http: HttpService
  ) { }

  public getClassStats(pk: number, timeline: Timelines): Observable<IStats> {
    return this._http.Get<IStats>(`stats/class/${pk}`, {
      params: new HttpParams().set("period", timeline)
    })
      .pipe(
        map(s => this.normalize(s, timeline)),
        take(1)
      )
  }

  public getStudentStats(pk: number, timeline: Timelines): Observable<IStats> {
    return this._http.Get<IStats>(`stats/student/${pk}`, {
      params: new HttpParams().set("period", timeline)
    })
      .pipe(
        map(s => this.normalize(s, timeline)),
        take(1)
      )
  }

  private normalize(stats: IStats, timeline: Timelines) {
    if (timeline === Timelines.Month)
      return this.normalizeMonth(stats)

    return stats
  }

  private normalizeMonth(stats: IStats) {
    if (stats.stats.length === 0)
      return stats

    const prev = new Date()
    const now = new Date()

    let prevAvg = NaN
    let prevStats: (Omit<IStatsItemRequest, "date"> & { date: Date })[] = []

    const result: IStats = {
      stats: []
    }
    let i = 0

    now.setDate(now.getDate() + 1)
    prev.setMonth(prev.getMonth() - 1)

    while(prev.getDate() !== now.getDate() + 1 || prev.getMonth() !== now.getMonth()) {
      const [statsDay, statsMonth, statsYear] = i < stats.stats.length
        ? stats.stats[i].date.split(".").map(e => +e)
        : [undefined, undefined, undefined]

      const statsDate = statsDay && statsMonth && statsYear
        ? new Date(statsYear, statsMonth - 1, statsDay)
        : undefined

      if (statsDate && statsDate.getDate() === prev.getDate() && statsDate.getMonth() === prev.getMonth())
      {
        if (prevStats.length > 0) {
          const step = (stats.stats[i].avg - prevAvg) / (prevStats.length + 1)
          prevStats.map(s => ({
            ...s,
            avg: prevAvg += step
          }))
          result.stats.push(...prevStats.map(e => ({...e, date: `${e.date.getDate()}.${e.date.getMonth() + 1}`})))
          prevStats = []
        }

        prevAvg = stats.stats[i].avg
        result.stats.push({...stats.stats[i], date: `${statsDate.getDate()}.${statsDate.getMonth() + 1}`})
        prev.setDate(prev.getDate() + 1)
        i++
        continue
      }

      if (isNaN(prevAvg))
      {
        result.stats.push({
          date: `${prev.getDate()}.${prev.getMonth() + 1}`,
          avg: 0
        })
        prev.setDate(prev.getDate() + 1)
        continue
      }

      prevStats.push({
        date: new Date(prev),
        avg: NaN
      })
      prev.setDate(prev.getDate() + 1)
    }

    return result
  }
}
