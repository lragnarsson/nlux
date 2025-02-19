import {existsSync} from 'fs';
import {info, nl} from '../utils/log.mjs';
import {run} from './run.mjs';

if (!existsSync('dist')) {
    nl(1);
    info(' No dist directory found ❌ ! Run `yarn set` or `yarn reset` first.');
    nl(1);
    process.exit(1);
}

nl(1);
info(' ############################################### ');
info(` # 🚂 Pipeline Step: Test                      # `);
info(' ############################################### ');
nl(1);

try {
    //
    // Run tests
    //
    run('cd specs && yarn test', true)
        .then(() => process.exitCode = 0)
        .catch(() => process.exitCode = 1);
} catch (_error) {
    process.exit(1);
}
