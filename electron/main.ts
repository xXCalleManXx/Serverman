import {InitApp} from "./nestjs";

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

InitApp(serve);
