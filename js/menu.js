import scssVars from "!!sass-variable-loader?preserveVariableNames!../scss/util/_variables.scss";

/**
 * Class representing the main menu navigation.
 */
export default class Menu {
  constructor(navbarSelector) {
    this.navbar = document.querySelector(navbarSelector);
    this.navbarId = navbarSelector.replace(".", "#");
    this.menus = this.navbar ? this.navbar.querySelectorAll("details") : null;
    this.navOverlay = document.querySelector(".nav-overlay");
    this.mainMenu = document.getElementById("navbar");
    this.mainMenuItems = this.mainMenu ? this.mainMenu.querySelectorAll("details") : null;
    this.mobileView;
  }

  handleNonMenuClick = (e) => {
    const breakpoint = "(max-width: " + scssVars["breakpointDesktop"] + ")";
    this.mobileView = window.matchMedia(breakpoint);
    // Close openthis.menus if the user clicks on a non-menu item
    if (
      this.navbar &&
      this.navbar !== e.target &&
      !this.navbar.contains(e.target)
    ) {
      this.menus.forEach((thisDetail) => {
        if (thisDetail.open) {
          thisDetail.removeAttribute("open");
          // Prevents overrides for overlay div on mobile
          if (!this.mobileView.matches) {
            document.body.classList.remove("no-scroll");
            this.navOverlay.style.display = "none";
          } 
        } 
      });  
    }     
  };

  handleEscapeKey = (e) => {
    // Close openthis.menus if the esc key is pressed
    if (e.key == "Escape")
      this.menus.forEach((thisDetail) => {
        if (thisDetail.open) thisDetail.removeAttribute("open");
        document.body.classList.remove("no-scroll");
        this.navOverlay.style.display = "none";
      });
    return;
  };

  asyncDropdown = () => {
    if (this.navbar) {
      // Close an open menu if another menu item is opened
      this.menus.forEach((thisDetail, _, details) => {
        thisDetail.ontoggle = (_) => {
          if (thisDetail.open) {
            details.forEach((thatDetail) => {
              if (thatDetail != thisDetail) thatDetail.removeAttribute("open");
              document.body.classList.remove("no-scroll");
              this.navOverlay.style.display = "none";
            });
          }
        };
      });
      // Applies overlay div only to the main menu
      this.mainMenuItems.forEach((thisDetail, _, details) => {
        thisDetail.ontoggle = (_) => {
          // Close an open menu if another menu item is opened
          if (thisDetail.open) {
            details.forEach((thatDetail) => {
              if (thatDetail != thisDetail) thatDetail.removeAttribute("open");
              document.body.classList.add("no-scroll");
              this.navOverlay.style.display = "block";
            });
          }
        };
      });

      document.addEventListener("pointerdown", this.handleNonMenuClick);
      document.addEventListener("keydown", this.handleEscapeKey);
      window.addEventListener("hashchange", this.handleScrollAndOverlay);
    }
  };

  handleScrollAndOverlay = (e) => {
    if (e.newURL.includes(this.navbarId)) {
      document.body.classList.add("no-scroll");
      this.navbar.classList.add("scroll");
      this.navOverlay.style.display = "block";
      return;
    } else {
      document.body.classList.remove("no-scroll");
      this.navbar.classList.remove("scroll");
      if (this.navOverlay) this.navOverlay.style.display = "none";
      return;
    }
  };
}
