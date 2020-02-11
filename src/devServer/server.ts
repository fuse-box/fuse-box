export interface IServer {
  onComplete: (props: any) => void;
}

export const createServer = (): IServer => {
  return {
    onComplete: ({ electron, runResponse, server }): void => {
      console.log(server, electron, runResponse);
    },
  };
};
