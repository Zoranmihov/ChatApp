import * as mongoose from 'mongoose';

export class DBHelper {
  static init(): void {
    mongoose
      .connect(
        'mongodb+srv://FakeUser:FakeUser97@cluster0.cxkvv.mongodb.net/ChatApp',
      )
      .then(() => console.log('Connection to mongoDB successful'))
      .catch((e: Error) => console.log(`Could not connect to mongo.\n\n${e}`));
  }
}
