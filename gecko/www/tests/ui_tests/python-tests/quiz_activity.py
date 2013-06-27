#!/usr/local/bin/python
# -*- coding: utf-8 -*-from selenium import webdriver
import os, sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.common.keys import Keys

class QuizActivity(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_quiz_activity(self):
        driver = self.driver
        driver.get("http://localhost:8000/")
        driver.get_screenshot_as_file('701.png')
        driver.find_element_by_css_selector("h1.ui-li-heading").click()
        driver.get_screenshot_as_file('70.png')
        driver.find_element_by_css_selector("#accesslevel > h1.ui-li-heading").click()
        driver.get_screenshot_as_file('71.png')
        driver.find_element_by_xpath("(//a[@id='accessactivity']/h1)[2]").click()
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        driver.find_element_by_css_selector("#quizSelectAnswer > h1.ui-li-heading").click()
        element2 = WebDriverWait(driver, 30).until((EC.element_to_be_clickable((By.ID, "dialogOK"))))
        driver.get_screenshot_as_file('72.png')
        driver.find_element_by_id("dialogOK").click()
        try: self.is_element_present(By.LINK_TEXT, "The Life of Brodsky✓ Your best score: 100")
        except AssertionError as e: self.verificationErrors.append(str(e))
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException, e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException, e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
