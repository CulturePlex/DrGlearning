from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re

class ChangeSettings(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.PhantomJS(desired_capabilities={'javascriptEnabled': 'true','local-storage-path':'/home/pedro/cultureplex/DrGlearning/gecko/www/tests/','webStorageEnabled':'true'})
        self.driver.implicitly_wait(1)
        self.base_url = "http://change-this-to-the-site-you-are-testing/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_change_settings(self):
        driver = self.driver
        #print(WebStorage(driver).getLocalStorage())
        # ERROR: Caught exception [ERROR: Unsupported command [setSpeed | 500 | ]]
        # ERROR: Caught exception [ERROR: Unsupported command [runScript |  window.localStorage.clear(); | ]]
        #driver.execute_script("window.localStorage.setItem('somekey', falsyValue);");
        driver.get("http://localhost:8000")
        driver.get_screenshot_as_file('ss.png')
        driver.find_element_by_css_selector("#startingImportUser > span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        driver.find_element_by_id("inputSyncStarting").clear()
        driver.find_element_by_id("inputSyncStarting").send_keys("e6008ba1775822a69687ee783a0b1b6fda94564d")
        driver.find_element_by_css_selector("#syncStartingOK > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_css_selector("span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_id("username").clear()
        driver.find_element_by_id("username").send_keys("pedro")
        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("palmagroblanco@gmail.com")
        driver.find_element_by_css_selector("span.ui-btn-inner").click()
        driver.find_element_by_css_selector("#saveSettings > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_css_selector("span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        try: self.assertEqual("pedro", driver.find_element_by_id("username").get_attribute("value"))
        except AssertionError as e: self.verificationErrors.append(str(e))
        try: self.assertEqual("palmagroblanco@gmail.com", driver.find_element_by_id("email").get_attribute("value"))
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
