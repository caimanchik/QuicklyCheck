import { Injectable } from '@angular/core';
import { HttpService } from "./infrastructure/http.service";
import { map, Observable, take } from "rxjs";
import { IPeriodStats } from "../interfaces/Stats/IPeriodStats";
import { Timelines } from "../enums/Timelines";
import { IStatsItemRequest } from "../interfaces/Stats/IStatsItemRequest";
import { HttpParams } from "@angular/common/http";
import { IQuestionStats } from "../interfaces/Stats/IQuestionStats";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(
    private _http: HttpService
  ) { }

  public getClassStats(pk: number, timeline: Timelines): Observable<IPeriodStats> {
    return this._http.Get<IPeriodStats>(`stats/class/${pk}`, {
      params: new HttpParams().set("period", timeline),
      withCredentials: true
    })
      .pipe(
        map(s => this.normalize(s, timeline)),
        take(1)
      )
  }

  public getStudentStats(pk: number, timeline: Timelines): Observable<IPeriodStats> {
    return this._http.Get<IPeriodStats>(`stats/student/${pk}`, {
      params: new HttpParams().set("period", timeline),
      withCredentials: true
    })
      .pipe(
        map(s => this.normalize(s, timeline)),
        take(1)
      )
  }

  public getTestStats(pk: number) {
    return this._http.Get<IQuestionStats>(`stats/quiz/${pk}`)
      .pipe(take(1))
  }

  private normalize(stats: IPeriodStats, timeline: Timelines) {
    switch (timeline) {
      case Timelines.Month:
        return this.normalizeMonth(stats)
      case Timelines.Year:
        return this.normalizeYear(stats)
      default:
        return stats
    }
  }

  private normalizeMonth(stats: IPeriodStats) {
    if (stats.stats.length === 0)
      return stats

    const prev = new Date()
    const now = new Date()

    now.setDate(now.getDate() + 1)
    prev.setMonth(prev.getMonth() - 1)

    return this.normalizeUniversal(
      stats, now, prev,
      (first, second) => first.getDate() !== second.getDate() || first.getMonth() !== second.getMonth(),
      (statsItem) => {
        const [statsDay, statsMonth, statsYear] = statsItem.date.split(".").map(e => +e)
        return new Date(statsYear, statsMonth - 1, statsDay)
      },
      (statsDate, currentDate) => statsDate && statsDate.getDate() === currentDate.getDate() && statsDate.getMonth() === currentDate.getMonth(),
      (date) => `${date.getDate()}.${date.getMonth() + 1}`,
      (date) => date.setDate(date.getDate() + 1)
    )
  }

  private normalizeYear(stats: IPeriodStats) {
    if (stats.stats.length === 0)
      return stats

    const prev = new Date()
    const now = new Date()

    now.setMonth(now.getMonth() + 1)
    prev.setFullYear(prev.getFullYear() - 1)

    return this.normalizeUniversal(
      stats, now, prev,
      (first, second) => first.getMonth() !== second.getMonth() || first.getFullYear() !== second.getFullYear(),
      (statsItem) => {
        const [statsMonth, statsYear] = statsItem.date.split(".").map(e => +e)
        return new Date(statsYear + 2000, statsMonth - 1)
      },
      (statsDate, currentDate) => statsDate && statsDate.getMonth() === currentDate.getMonth() && statsDate.getFullYear() === currentDate.getFullYear(),
      (date) => `${date.getMonth() + 1}.${date.getFullYear() - 2000}`,
      (date) => date.setMonth(date.getMonth() + 1)
    )
  }

  private normalizeUniversal(stats: IPeriodStats, now: Date, prev: Date,
                             isSuitableDate: (first: Date, second: Date) => boolean,
                             getStatsDate: (date: IStatsItemRequest) => Date | undefined,
                             isDateGiven: (statsDate: Date, currentDate: Date) => boolean,
                             convertToViewDate: (date: Date) => string,
                             increaseDate: (date: Date) => void) {
    let prevAvg = NaN
    let prevStats: (Omit<IStatsItemRequest, "date"> & { date: Date })[] = []

    const result: IPeriodStats = {
      stats: []
    }
    let i = 0

    while(isSuitableDate(prev, now)) {
      const statsDate = i < stats.stats.length
        ? getStatsDate(stats.stats[i])
        : undefined

      if (statsDate && isDateGiven(statsDate, prev))
      {
        if (prevStats.length > 0) {
          const step = (stats.stats[i].avg - prevAvg) / (prevStats.length + 1)
          prevStats.map(s => ({
            ...s,
            avg: prevAvg += step
          }))
          result.stats.push(...prevStats.map(e => ({...e, date: convertToViewDate(e.date)})))
          prevStats = []
        }

        prevAvg = stats.stats[i].avg
        result.stats.push({...stats.stats[i], date: convertToViewDate(statsDate)})
        increaseDate(prev)
        i++
        continue
      }

      if (isNaN(prevAvg)) {
        result.stats.push({
          date: convertToViewDate(prev),
          avg: 0
        })
        increaseDate(prev)
        continue
      }

      prevStats.push({
        date: new Date(prev),
        avg: NaN
      })
      increaseDate(prev)
    }

    result.stats.push(...prevStats.map(e => ({...e, date: convertToViewDate(e.date)})))

    return result
  }
}
