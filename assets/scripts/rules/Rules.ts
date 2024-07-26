import { Vec3 } from "cc"
import { Ball } from "../Ball"
import { Table } from "../Table"

export interface Rules {
  cueball: Ball
  currentBreak: number
  previousBreak: number
  score: number
  rulename: string
  startTurn()
  nextCandidateBall()
  placeBall(target?): Vec3
  asset(): string
  tableGeometry()
  table(): Table
  rack(): Ball[]
  /* update(outcome: Outcome[]): Controller
  isPartOfBreak(outcome: Outcome[]): boolean
  isEndOfGame(outcome: Outcome[]): boolean */
  otherPlayersCueBall(): Ball
  secondToPlay()
  allowsPlaceBall(): boolean
}
