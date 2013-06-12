from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re

class SearchAndInstallCourse(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "file:///home/pedro/cultureplex/DrGlearning/gecko/www/index.html"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_search_and_install_course(self):
        driver = self.driver
        driver.find_element_by_xpath("//footer[@id='footermain']/navbar/ul/li[2]/a/span").click()
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length != 0 | 30000]]
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length == 0 | 30000]]
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$('#addcareerslist li').length | 30000]]
        driver.find_element_by_id("searchcourses").clear()
        driver.find_element_by_id("searchcourses").send_keys("presentation")
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length != 0 | 30000]]
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length == 0 | 30000]]
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$('#addcareerslist li').length | 30000]]
        driver.find_element_by_css_selector("#careertoinstall > h1.ui-li-heading").click()
        driver.find_element_by_css_selector("#confirmInstall > span.ui-btn-inner.ui-btn-corner-all").click()
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length != 0 | 30000]]
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length == 0 | 30000]]
        try: self.assertEqual("Presentation", driver.find_element_by_css_selector("h1.ui-li-heading").text)
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
