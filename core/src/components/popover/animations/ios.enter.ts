import { Animation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';
import { calculateWindowAdjustment, getArrowDimensions, getPopoverDimensions, getPopoverPosition } from '../utils';

const POPOVER_IOS_BODY_PADDING = 5;

/**
 * iOS Popover Enter Animation
 */
export const iosEnterAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
  const { event: ev, size, trigger, reference, side, align } = opts;
  const doc = (baseEl.ownerDocument as any);
  const isRTL = doc.dir === 'rtl';
  const bodyWidth = doc.defaultView.innerWidth;
  const bodyHeight = doc.defaultView.innerHeight;
  const arrowEl = baseEl.querySelector('.popover-arrow') as HTMLElement | null;

  const contentEl = baseEl.querySelector('.popover-content') as HTMLElement;
  const { contentWidth, contentHeight } = getPopoverDimensions(size, contentEl, trigger);
  const { arrowWidth, arrowHeight } = getArrowDimensions(arrowEl);

  const defaultPosition = {
    top: bodyHeight / 2 - contentHeight / 2,
    left: bodyWidth / 2 - contentWidth / 2
  }

  const results = getPopoverPosition(isRTL, contentWidth, contentHeight, arrowWidth, arrowHeight, reference, side, align, defaultPosition, trigger, ev);

  const { originX, originY, top, left, bottom, checkSafeAreaLeft, checkSafeAreaRight, arrowTop, arrowLeft } = calculateWindowAdjustment(results.top, results.left, POPOVER_IOS_BODY_PADDING, bodyWidth, bodyHeight, contentWidth, contentHeight, isRTL, 25, results.referenceCoordinates, results.arrowTop, results.arrowLeft);

  const adjustedForBounds = top !== results.top || left !== results.left || bottom !== undefined;

  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop')!)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
    .beforeStyles({
      'pointer-events': 'none'
    })
    .afterClearStyles(['pointer-events']);

  wrapperAnimation
    .addElement(baseEl.querySelector('.popover-wrapper')!)
    .fromTo('opacity', 0.01, 1);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease')
    .duration(100)
    .beforeAddWrite(() => {
      if (size === 'cover') {
        baseEl.style.setProperty('--width', `${contentWidth}px`);
      }

      if (bottom !== undefined) {
        contentEl.style.setProperty('bottom', `${bottom}px`);
      }

      const safeAreaLeft = ' + var(--ion-safe-area-left, 0)';
      const safeAreaRight = ' - var(--ion-safe-area-right, 0)';

      let leftValue = `${left}px`;

      if (checkSafeAreaLeft) {
        leftValue = `${left}px${safeAreaLeft}`;
      }
      if (checkSafeAreaRight) {
        leftValue = `${left}px${safeAreaRight}`;
      }

      contentEl.style.setProperty('top', `calc(${top}px + var(--offset-y, 0))`);
      contentEl.style.setProperty('left', `calc(${leftValue} + var(--offset-x, 0))`);
      contentEl.style.setProperty('transform-origin', `${originY} ${originX}`);

      /**
       * If popover is adjusted according to
       * window bounds then we want to hide the
       * arrow because it will no longer point
       * to the reference point.
       */
      if (arrowEl) {
        if (adjustedForBounds) {
          arrowEl.style.setProperty('display', 'none');
        } else {
          arrowEl.style.setProperty('top', `calc(${arrowTop}px + var(--offset-y, 0))`);
          arrowEl.style.setProperty('left', `calc(${arrowLeft}px + var(--offset-x, 0))`);
        }
      }
    })
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
