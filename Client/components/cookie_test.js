"use strict";

class CookieTest extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./static/bootstrap.css" />
      <style>
        .custom-box {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
        }
      </style>
      <div class="container shadow-sm p-3 mb-5 bg-body-tertiary rounded custom-box">
        <div class="alert alert-warning" role="alert">
          前端 Cookie 操作测试组
        </div>
        <div class="container">
          <div class="d-flex gap-2 mb-3">
            <button id="set-btn" class="btn btn-success">设置 Cookie</button>
            <button id="get-btn" class="btn btn-info">获取 Cookie</button>
            <button id="clear-btn" class="btn btn-danger">清除 Cookie</button>
          </div>
          <div class="mt-3">
            <p class="mb-1"><strong>当前 document.cookie 结果：</strong></p>
            <div id="cookie-display" class="p-2 border rounded bg-light text-break" style="min-height: 50px;">未获取</div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.shadowRoot.querySelector("#set-btn").addEventListener("click", () => this.setCookie());
    this.shadowRoot.querySelector("#get-btn").addEventListener("click", () => this.getCookie());
    this.shadowRoot.querySelector("#clear-btn").addEventListener("click", () => this.clearCookie());
  }

  setCookie() {
    document.cookie = "frontend_cookie=hello_from_client; path=/; max-age=3600";
    this.updateDisplay("Cookie 已设置: frontend_cookie=hello_from_client");
  }

  getCookie() {
    const currentCookie = document.cookie;
    this.updateDisplay(currentCookie || "空 (没有可用的 Cookie)");
  }

  clearCookie() {
    document.cookie = "frontend_cookie=; path=/; max-age=0";
    this.updateDisplay("Cookie 已清除 (frontend_cookie)");
  }

  updateDisplay(text) {
    const display = this.shadowRoot.querySelector("#cookie-display");
    display.textContent = text;
  }
}

export default CookieTest;
