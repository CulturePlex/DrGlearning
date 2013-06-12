from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re

class ExportImportUser(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "file:///home/pedro/cultureplex/DrGlearning/gecko/www/index.html"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_export_import_user(self):
        driver = self.driver
        driver.find_element_by_css_selector("span.ui-btn-inner").click()
        driver.find_element_by_css_selector("#exportUser > span.ui-btn-inner").click()
        driver.find_element_by_css_selector("#syncCancel > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_css_selector("#importUser > span.ui-btn-inner").click()
        driver.find_element_by_id("inputSync").click()
        driver.find_element_by_id("inputSync").clear()
        driver.find_element_by_id("inputSync").send_keys("e6008ba1775822a69687ee783a0b1b6fda94564d")
        driver.find_element_by_css_selector("span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_css_selector("#syncOK > span.ui-btn-inner.ui-btn-corner-all").click()
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length == 0 | 30000]]
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_xpath("//a[@id='backfromsettings']/span/span[2]").click()
    
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
