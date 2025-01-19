export interface IQuestionStats {
  stats: {
    questions: { [key: string]: number },
    mostHardQuestion: number
  }
}
