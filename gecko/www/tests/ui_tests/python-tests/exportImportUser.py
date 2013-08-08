#Export and Import User Python Test Case
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0


class ExportImportUser(unittest.TestCase):
    #Setting up Test Suite (Selecting PhantomJS as driver, setting up base_url and implicit waits)
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True
    #Export and Import User Test Case
    def test_export_import_user(self):
        driver = self.driver
        driver.get("http://localhost:8000/")
        driver.find_element_by_css_selector("span.ui-btn-inner").click()
        driver.find_element_by_css_selector("#exportUser > span.ui-btn-inner").click()
        driver.find_element_by_css_selector("#syncCancel > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_css_selector("#importUser > span.ui-btn-inner").click()
        driver.find_element_by_id("inputSync").click()
        driver.find_element_by_id("inputSync").clear()
        driver.find_element_by_id("inputSync").send_keys("e6008ba1775822a69687ee783a0b1b6fda94564d")
        driver.find_element_by_id("syncOK").click()
        driver.find_element_by_css_selector("#syncOK > span.ui-btn-inner.ui-btn-corner-all").click()
        elemento = driver.find_element_by_css_selector(".blockUI")
        element2 = WebDriverWait(driver, 10).until((EC.staleness_of(elemento)))
        driver.find_element_by_id("dialogOK").click()
   
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
