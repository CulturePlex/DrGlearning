from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re

class UninstallCourse(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(1)
        self.base_url = "http://localhost:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_uninstall_course(self):
        driver = self.driver
        driver.get("http://localhost:8000/")
        driver.find_element_by_css_selector("h1.ui-li-heading").click()
        driver.find_element_by_css_selector("#uninstall > span.ui-btn-inner").click()
        driver.find_element_by_css_selector("#confirmInstall > span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        driver.find_element_by_css_selector("h1.ui-li-heading").click()
        driver.find_element_by_css_selector("#uninstall > span.ui-btn-inner > span.ui-btn-text").click()
        driver.find_element_by_css_selector("#confirmInstall > span.ui-btn-inner.ui-btn-corner-all").click()
        try: self.is_element_present(By.LINK_TEXT, "No careers installed")
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
