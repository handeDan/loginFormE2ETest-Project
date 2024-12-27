import React from "react";
// cypress/e2e/login.cy.js
import { BrowserRouter } from "react-router-dom"; // React Router'ı kullanmak için
import "@cypress/react/support"; // Cypress React destek dosyasını import et
import { useNavigate } from "react-router-dom"; // Doğru import
import Login from "../src/components/Login";

describe("Login Form Tests", () => {
  beforeEach(() => {
    // Test öncesi, Login sayfasını ziyaret ediyoruz.
    mount(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });
  // a) Başarılı form doldurulduğunda submit edebiliyoruz ve Success sayfasını açabiliyoruz:
  it("should submit form successfully and navigate to success page", () => {
    // Doğru email ve password giriyoruz.
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("Password123!");

    // Onay kutusunu işaretliyoruz (örneğin, "Kuralları kabul et").
    cy.get('input[type="terms"]').check();

    // Submit butonunun aktif olup olmadığını kontrol ediyoruz
    cy.get('button[type="submit"]').should("not.be.disabled");

    // Formu gönderiyoruz
    cy.get('button[type="submit"]').click();

    // Success sayfasına yönlendirildiğimizi doğruluyoruz
    cy.url().should("include", "/success");
  });
  // b) Hatalı durumlarda beklenen hata mesajları görünüyor ve buton disabled kalıyor.

  context("Invalid Inputs", () => {
    // i. Email yanlış girildiğinde
    it("should show an error for incorrect email and disable the submit button", () => {
      // Yanlış email giriyoruz
      cy.get('input[name="email"]').type("invalid-email");
      cy.get('input[name="password"]').type("Password123!");

      // Hata mesajının ekranda olduğunu doğruluyoruz
      cy.get(".email-error")
        .should("be.visible")
        .and("contain", "Please enter a valid email address");

      // Submit butonunun disabled olduğunu kontrol ediyoruz
      cy.get('button[type="submit"]').should("be.disabled");
    });
    // ii. Email ve password yanlış girildiğinde
    it("should show errors for both email and password and disable the submit button", () => {
      // Yanlış email ve password giriyoruz
      cy.get('input[name="email"]').type("invalid-email");
      cy.get('input[name="password"]').type("short");

      // Her iki hata mesajının ekranda olduğunu doğruluyoruz
      cy.get(".email-error")
        .should("be.visible")
        .and("contain", "Please enter a valid email address");
      cy.get(".password-error")
        .should("be.visible")
        .and(
          "contain",
          "Password must be at least 5 characters, at least one letter and one number"
        );

      // Submit butonunun disabled olduğunu kontrol ediyoruz
      cy.get('button[type="submit"]').should("be.disabled");
    });
    // iii. Email ve password doğru ama kuralları kabul etmedim
    it("should keep submit button disabled if terms are not accepted", () => {
      // Doğru email ve password giriyoruz
      cy.get('input[name="email"]').type("test@example.com");
      cy.get('input[name="password"]').type("Password123!");

      // Onay kutusunu işaretlemiyoruz
      cy.get('button[type="submit"]').should("be.disabled");
    });
  });
});
