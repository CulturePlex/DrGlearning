#Update All Courses Python Test Case

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.common.keys import Keys

class UpdateAllCourses(unittest.TestCase):
    #Setting up Test Suite (Selecting PhantomJS as driver, setting up base_url and implicit waits)
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(1)
        self.base_url = "http://localhost:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    #Update All Courses Test Case, first of all we install another course (museums)
    def test_update_all_courses(self):
        driver = self.driver
        driver.get("http://localhost:8000/")
        #Accessing Add Courses View
        driver.find_element_by_id("addCoursesButton").click()
        driver.find_element_by_id("searchcourses").clear()
        #Searching for Museums Course
        driver.find_element_by_id("searchcourses").send_keys("museums")
        #Pushing Return Key 
        driver.find_element_by_id("searchcourses").send_keys(Keys.RETURN);
        #Waiting for blockUI to hide
        elemento = driver.find_element_by_css_selector(".blockUI")
        element = WebDriverWait(driver, 10).until((EC.staleness_of(elemento)))
        #Clicking career to install
        driver.find_element_by_css_selector("#careertoinstall > h1.ui-li-heading").click()
        #Confirm installation
        driver.find_element_by_css_selector("#confirmInstall > span.ui-btn-inner.ui-btn-corner-all").click()
        #Waiting for blockUI to hide
        elemento1 = driver.find_element_by_css_selector(".blockUI")
        element1 = WebDriverWait(driver, 30).until((EC.staleness_of(elemento1)))
        #Outting of date courses in order to update them with update all courses function
        driver.execute_script('Dao.careersStore.get(4,function(me){temp = me;}); temp.value.timestamp ="2012-01-21T21:04:24.095452";  Dao.careersStore.save({key:4,value : temp.value});Dao.careersStore.get(1,function(me){temp2 = me;}); temp2.value.timestamp ="2012-01-21T21:04:24.095452";  Dao.careersStore.save({key:1,value : temp2.value});')
        driver.find_element_by_css_selector("span.ui-btn-inner").click()
        #Clicking on update all
        driver.find_element_by_css_selector("#updateAll > span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        element2 = WebDriverWait(driver, 10).until((EC.element_to_be_clickable((By.ID, "dialogOK"))))
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
