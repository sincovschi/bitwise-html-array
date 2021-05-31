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
      const innerEl = document.createElement('div');
      el.appendChild(innerEl);
      const descEl = document.createElement('span');
      el.appendChild(descEl);

      enumFlags.forEach(f => {
        if ((commonFlag & f) != 0) {
          const signalTextualValue = SignalFlags[f];
          descEl.innerHTML += signalTextualValue + ' ';
          innerEl.classList.add(signalTextualValue);
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

source.subscribe((flag: SignalFlags) => {
  root.appendChild(htmlArary[flag]?.cloneNode(true));
});

document.getElementById('fillpage').onclick = () => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 1000; i++) {
    const randormFlag = Math.floor(Math.random() * (7) + 1);
    fragment.appendChild(htmlArary[randormFlag]?.cloneNode(true));
  }
  root.appendChild(fragment);
}