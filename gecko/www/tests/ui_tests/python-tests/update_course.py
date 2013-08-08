#Update Course Python Test Case

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.common.keys import Keys


class UpdateCourse(unittest.TestCase):
    #Setting up Test Suite (Selecting PhantomJS as driver, setting up base_url and implicit waits)
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(1)
        self.base_url = "http://localhost:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    #Update Course Test Case
    def test_update_course(self):
        driver = self.driver
        driver.get("http://localhost:8000/")
        #Making course Out of date via JS in order to update it
        driver.execute_script('Dao.careersStore.get(4,function(me){temp = me;}); temp.value.timestamp ="2012-01-21T21:04:24.095452";  Dao.careersStore.save({key:4,value : temp.value});')
        #Accessing Course
        driver.find_element_by_id("accesscareer").click()
        #Clicking on update course
        driver.find_element_by_css_selector("#update > span.ui-btn-inner").click()
        #Waiting for blockUI to hide
        elemento = driver.find_element_by_css_selector(".blockUI")
        element2 = WebDriverWait(driver, 10).until((EC.staleness_of(elemento)))
        #Clicking OK button in dialog
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
