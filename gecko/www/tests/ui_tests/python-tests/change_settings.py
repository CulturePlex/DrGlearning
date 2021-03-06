#Change Settings Python Test Case
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import selenium.webdriver.support.ui as ui
import unittest, time, re

class ChangeSettings(unittest.TestCase):
    #Setting up Test Suite (Selecting PhantomJS as driver, setting up base_url and implicit waits)
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(1)
        self.base_url = "http://localhost:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True
    #Change Settings Test Case
    def test_change_settings(self):
        driver = self.driver
        driver.get("http://localhost:8000/")
        #Clearing localStorage after Test Suite start
        driver.execute_script("window.localStorage.clear();")
        #Adding the key testing = true in localStorage to avoid JQuery Transitions
        driver.execute_script("window.localStorage.setItem('testing',true);")
        #Opening web to test
        driver.get("http://localhost:8000/")
        driver.implicitly_wait(1)
        #Start importing test user
        driver.find_element_by_css_selector("#startingImportUser > span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        driver.find_element_by_id("inputSyncStarting").clear()
        driver.find_element_by_id("inputSyncStarting").send_keys("e6008ba1775822a69687ee783a0b1b6fda94564d")
        driver.find_element_by_id("syncStartingOK").click()
        #Waiting until user importation finish 
        time.sleep(10)
        driver.find_element_by_id("dialogOK").click()
        driver.get("http://localhost:8000#settings")
        driver.find_element_by_id("username").clear()
        driver.find_element_by_id("username").send_keys("pedro")
        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("palmagroblanco@gmail.com")
        driver.find_element_by_id("saveSettings").click()
        driver.find_element_by_id("dialogOK").click()
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
