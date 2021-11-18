import 'dotenv/config'
import { serverHttp } from './app';

const port = process.env.PORT || 3000

serverHttp.listen(port, () => console.log(`listening on port 3000`));