const fs = require('fs');
let content = fs.readFileSync('src/components/Nav.tsx', 'utf8');

// We want to hide the Cart button if `user` is null.
// Let's replace the button rendering block to check `user &&`.
content = content.replace(
  '<button \n            onClick={onCart}',
  '{user && (\n          <button \n            onClick={onCart}'
);
content = content.replace(
  '</span>\n            )}\n          </button>\n\n          {user && (',
  '</span>\n            )}\n          </button>\n          )}\n\n          {user && ('
);

fs.writeFileSync('src/components/Nav.tsx', content);
