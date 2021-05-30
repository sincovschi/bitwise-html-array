import { of, from } from 'rxjs';
import { delay, concatMap } from 'rxjs/operators';
import { SignalFlags } from './types';
import { getEnumFlags } from './helpers';

import './style';

function generateHtmlArray(enumFlags: SignalFlags[]) {
  const htmlArary: HTMLLIElement[] = [];

  var f = function(flag: SignalFlags, restEnumFlags: SignalFlags[]) {
    for (var i = 0; i < restEnumFlags.length; i++) {
      const currentFlag = restEnumFlags[i];
      const commonFlag = currentFlag | flag;

      const el = document.createElement('li');

      enumFlags.forEach(f => {
        if ((commonFlag & f) != 0) {
          el.classList.add(SignalFlags[f]);
        }
      });

      htmlArary[commonFlag] = el;

      f(commonFlag, restEnumFlags.slice(i + 1));
    }
  };

  f(0, enumFlags);

  return htmlArary;
}

const enumFlags = getEnumFlags(SignalFlags);

const htmlArary: HTMLLIElement[] = generateHtmlArray(enumFlags);

const source = from([1, 2, 3, 4, 5, 6, 7]).pipe(concatMap(val => of(val).pipe(delay(500))));

const root = document.getElementById('root');

source.subscribe(flag => {
  root.appendChild(htmlArary[flag]?.cloneNode(true));
});
