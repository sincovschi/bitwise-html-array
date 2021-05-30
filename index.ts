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
      const descEl = document.createElement('span');
      el.appendChild(descEl);

      enumFlags.forEach(f => {
        if ((commonFlag & f) != 0) {
          const signalTextualValue = SignalFlags[f];
          descEl.innerHTML += signalTextualValue + ' ';
          const innerEl = document.createElement('div');
          innerEl.classList.add(signalTextualValue);
          el.appendChild(innerEl);
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

const source = from([7, 6, 5, 4, 3, 2, 1]).pipe(concatMap(val => of(val).pipe(delay(500))));

const root = document.getElementById('root');

const addHtmlFlagToRoot = (flag: SignalFlags) => {
  root.appendChild(htmlArary[flag]?.cloneNode(true));
}

source.subscribe(addHtmlFlagToRoot);

document.getElementById('fillpage').onclick = () => {
  for (let i = 0; i < 1000; i++) {
    const randormFlag = Math.floor(Math.random() * (7) + 1);
    addHtmlFlagToRoot(randormFlag);
  }
}