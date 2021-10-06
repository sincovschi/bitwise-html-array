import { of, from } from 'rxjs';
import { delay, concatMap } from 'rxjs/operators';
import { SignalFlags } from './types';
import { getEnumFlags } from './helpers';

import './style';

function useCreateLIElement() {
  const el = document.createElement('li');
  const innerEl = document.createElement('div');
  el.appendChild(innerEl);
  const descEl = document.createElement('span');
  el.appendChild(descEl);

  function setElFlag(text) {
    descEl.textContent += text + ' ';
    innerEl.classList.add(text);
  }
  return { el, setElFlag };
}

function generateHtmlArray(enumFlags: SignalFlags[]) {
  const htmlArary: HTMLLIElement[] = [];

  function recursiveFlagCombination(
    startFlag: SignalFlags,
    restEnumFlags: SignalFlags[]
  ) {
    restEnumFlags.forEach((flag, i) => {
      const { el, setElFlag } = useCreateLIElement();
      const combinedFlag = flag | startFlag;

      for (
        let tempFlag = combinedFlag, lowestFlag = 0;
        tempFlag != 0;
        tempFlag ^= lowestFlag // XOR removes lowestFlag
      ) {
        lowestFlag = tempFlag & (~tempFlag + 1);
        const flagTextualValue = SignalFlags[lowestFlag];
        setElFlag(flagTextualValue);
      }

      htmlArary[combinedFlag] = el;

      recursiveFlagCombination(combinedFlag, restEnumFlags.slice(i + 1));
    });
  }

  recursiveFlagCombination(0, enumFlags);

  return htmlArary;
}

const enumFlags = getEnumFlags(SignalFlags);

const htmlArary: HTMLLIElement[] = generateHtmlArray(enumFlags);

const source = from([7, 6, 5, 4, 3, 2, 1]).pipe(
  concatMap((val) => of(val).pipe(delay(500)))
);

const root = document.getElementById('root');

source.subscribe((flag: SignalFlags) => {
  root.appendChild(htmlArary[flag]?.cloneNode(true));
});

document.getElementById('fillpage').onclick = () => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 1000; i++) {
    const randormFlag = Math.floor(Math.random() * 7 + 1);
    fragment.appendChild(htmlArary[randormFlag]?.cloneNode(true));
  }
  root.appendChild(fragment);
};
