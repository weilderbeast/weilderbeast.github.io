import { make } from "../utils/utils";

const baseTemplate = /*html*/ `
    <div class="section section-1 marquee">brutal</div>
    <div class="section section-2">
        <div class="desktop">
            <div class="carousel-left carousel-wrapper carousel-tall"></div>
        </div>
        <div class="mobile">
            <div
            class="carousel-mobile carousel-wrapper carousel-tall"
            data-timeout="2000"
            ></div>
        </div>
    </div>
    <div class="section section-3">
        <div style="height: 100%;display: flex;justify-content: space-between;flex-direction: column">
            <div>bogdan-florin cîrstoiu - web developer</div>
            <div class="desktop">"If you wish to make an apple pie from scratch, you must first invent the universe."<br> - Carl Sagan</div>
            <div>javascript typescript react node bun git docker linux php(kinda)</div>
        </div>
    </div>
    <div class="section section-4" data-viewport-classes="button">
        <div class="desktop">
            <div
            class="carousel-right carousel-wrapper carousel-tall"
            data-timeout="3000"
            ></div>
        </div>
        <div class="mobile">
            <div class="text-fit" data-toggle="modal" data-target="#projects">
                projects
            </div>
        </div>
    </div>
    <div class="section section-5 button">
        <div class="mobile">
            <div class="text-fit" data-toggle="modal" data-target="#about">
                about
            </div>
        </div>
        <div class="desktop">
            <div class="text-fit" data-toggle="modal" data-target="#projects">
                projects
            </div>
        </div>
    </div>
    <div class="section section-6">
        <div class="desktop">
            <div
            class="carousel-center carousel-wrapper carousel-tall "
            data-timeout="3000"
            ></div>
        </div>
        <div class="mobile">
            <div style="margin-bottom: 8px">
            copyright @ 2026.<br />
            all rights reserved.
            </div>

            <div
            style="
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            "
            >
            <div>
                <a href="#">github</a>
                <a href="#">contact</a>
            </div>

            <div>
                <button data-toggle="modal" data-target="#theme">theme</button>
            </div>
            </div>    
        </div>
    </div>
    <div class="section section-7 text-fit button centered" data-toggle="modal" data-target="#about">
        about
    </div>
    <div class="section section-8">
        <div>
        copyright @ 2026.<br />
        all rights reserved.
        </div>

        <div
        style="
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        "
        >
        <div>
            <a href="https://github.com/weilderbeast">github</a>
            <a href="mailto:cirstoiu.bogdan.florin@gmail.com">contact</a>
        </div>

        <div>
            <button data-toggle="modal" data-target="#theme">theme</button>
        </div>
        </div>
    </div>
    <div id="theme" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">theme</h5>
                    <div class="btn-close" data-dismiss="modal">x</div>
                </div>
                <div class="modal-body">
                    <button type="button" class="dark theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="dark">dark</span>
                        <span class="hex">hex 000000</span>
                    </button>
                    <button type="button" class="light theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="light">light</span>
                        <span class="hex">hex ffffff</span>
                    </button>
                    <button type="button" class="ocean theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="ocean">ocean</span>
                        <span class="hex">hex 03045e</span>
                    </button>
                    <button type="button" class="child theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="child">child</span>
                        <span class="hex">hex 9b5de5</span>
                    </button>
                    <button type="button" class="soft theme-btn" style="justify-content: space-between"> 
                        <span class="title" data-theme="soft">soft</span>
                        <span class="hex">hex 780116</span>
                    </button>
                </div>
                <div class="modal-footer">
                    <button type="button" data-dismiss="modal">cancel</button>
                    <button type="button" id="theme-apply-btn">apply</button>
                </div>
            </div>
        </div>
    </div>
    <div id="about" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">about</h5>
                    <div class="btn-close" data-dismiss="modal">x</div>
                </div>
                <div class="modal-body">
                    <p>Bogdan-Florin Cîrstoiu<br>Bucharest - Romania</p>
                    <p>Aspiring web developer, with a passion for the inner-workings of day-to-day things, always ready for a challenge, and extremely curious by nature.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" data-dismiss="modal">close</button>
                </div>
            </div>
        </div>
    </div>
    <div id="projects" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">projects</h5>
                    <div class="btn-close" data-dismiss="modal">x</div>
                </div>
                <div class="modal-body">
                    <p>nothing here (yet).</p>
                </div>
                <div class="modal-footer">
                    <button type="button" data-dismiss="modal">close</button>
                </div>
            </div>
        </div>
    </div>
`;

const loadingScreenTemplate = `
    loading...
`;

export const base = make("div", {
  class: "fancy-grid",
  html: baseTemplate,
});

export const loading = make("div", {
  text: loadingScreenTemplate,
  style: {
    position: "absolute",
    left: "0",
    right: "0",
    width: "100dvw",
    height: "100dvh",
    backgroundColor: "inherit",
    color: "inherit",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "999999999",
  },
});
