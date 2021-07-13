export interface IReaction {
  dependencies?: {
    [key: string]: string
  }
  fulfill?: {
    state?: {
      [key: string]: string
    }
    schema?: {
      [key: string]: string
    }
  }
}
