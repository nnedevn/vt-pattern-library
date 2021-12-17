export default class ContentSlider {
  /**
   * TODO:
   * !! - Fix the Controls repositioning logic in the resizeObserver.
   * !! - Investigate the reason the controls click area diverges from img div on different browser zoom levels
   *  - Fix tab indexes (user should not be able to scroll by tabbing // add visibility classes )
   *  - Refactor addition of event listeners into a separate function. DRY-er.
   *
   * Notes:
   *  - Clickable area off by 20px due to 2rem padding on .demo-section
   *  - Viewport top position start at [0, 79], not sure why.
   */
  constructor(wrapperObj) {
    this.contentSlider = wrapperObj;
    let surfaceSelector = wrapperObj.dataset.controlSurface ? wrapperObj.dataset.controlSurface : 'content-slider__cards-list';
    this.controlSurface = wrapperObj.querySelector(`.${surfaceSelector}`);

    try {      /**
       * TODO: Refactor controlSurface so that it appends the controls div to the DOM, therefore removing the necesity for a controlSurface parameter to be passed in.
       */

      this.contentSliderCardsList = this.contentSlider.querySelector(
        ".content-slider__cards-list"
      );
      // Needed to calculate the content slider's scrolling step.
      this.firstCard = this.contentSliderCardsList.querySelector(".content-slider__block");
      this.contentSliderControls = this.contentSlider.querySelector(
        ".content-slider__controls"
      );
      this.controlsLeft = this.contentSliderControls.querySelector(
        ".content-slider__controls-left"
      );
      this.controlsRight = this.contentSliderControls.querySelector(
        ".content-slider__controls-right"
      );
      this.attachEventListeners();
      
      let initialTopValue = this.contentSliderControls.offsetTop; //79px

      this.contentSliderControls.style.top = `${this.controlSurface.offsetTop - initialTopValue
        }px`;
    } catch(e) {
      console.error(
        "[ContentSlider] There was a problem calculating the controls for the content slider: ", e
      );
    }
  }

  resizeControlSurface() {
    const controlSurfaceRect = this.controlSurface.getBoundingClientRect();
    this.contentSliderControls.style.height = `${controlSurfaceRect.height}px`;
    // calculate the step size for the content slider
    this.sliderStep = this.firstCard.offsetWidth;
  }

  attachEventListeners() {
    // TODO: Refactor to a single function with behavior based on event.someValue
    this.controlsLeft.addEventListener("click", (e) => {
      e.preventDefault();
      this.contentSliderCardsList.scrollLeft -= this.sliderStep; //px scroll amount
    });

    this.controlsRight.addEventListener("click", (e) => {
      e.preventDefault();
      this.contentSliderCardsList.scrollLeft += this.sliderStep; //px scroll amount
    });

    window.addEventListener("load", () => {
      this.resizeControlSurface();
    });

    window.addEventListener("resize", () => {
      this.resizeControlSurface();
    });
  }
}
