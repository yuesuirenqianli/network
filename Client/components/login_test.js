"use strict";

import { base_url } from "../config/config.js";

class LoginTest extends HTMLElement {
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
        /* 可以在这里编写特定于该组件的自定义样式 */
        .custom-box {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
        }
      </style>
      <div class="container shadow-sm p-3 mb-5 bg-body-tertiary rounded custom-box">
        <div class="alert alert-info" role="alert">
          基础测试组
        </div>
        <div class="container">
          <button type="submit" class="btn btn-primary">点击登录</button>
          <div class="mt-3">
            <p class="mb-1"><strong>用户名：</strong><span id="username" class="text-success">未登录</span></p>
            <p class="mb-0"><strong>Email：</strong><span id="email" class="text-success">未登录</span></p>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const btn = this.shadowRoot.querySelector(".btn");
    btn.addEventListener("click", () => this.login());
  }

  async login() {
    try {
      const res = await fetch(`${base_url}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const data = await res.json();
      this.updateResult(data.result);
    } catch (err) {
      this.updateResult(err);
    }
  }

  updateResult(data) {
    const usernameEl = this.shadowRoot.querySelector("#username");
    const emailEl = this.shadowRoot.querySelector("#email");
    usernameEl.textContent = data.name;
    emailEl.textContent = data.email;
  }
}

export default LoginTest;
