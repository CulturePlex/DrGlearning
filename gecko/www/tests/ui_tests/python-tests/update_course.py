from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re

class UpdateCourse(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "file:///home/pedro/cultureplex/DrGlearning/gecko/www/index.html"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_update_course(self):
        driver = self.driver
        # ERROR: Caught exception [ERROR: Unsupported command [runScript | Dao.careersStore.get(4,function(me){temp = me;}); temp.value.timestamp ="2012-01-21T21:04:24.095452";  Dao.careersStore.save({key:4,value : temp.value}); | ]]
        driver.find_element_by_id("accesscareer").click()
        driver.find_element_by_css_selector("#update > span.ui-btn-inner").click()
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length != 0 | 30000]]
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length == 0 | 30000]]
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$('#addcareerslist li').length | 30000]]
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all").click()
    
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
