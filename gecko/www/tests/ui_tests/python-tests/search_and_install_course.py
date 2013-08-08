#Search and Install Course Python Test Case

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.common.keys import Keys


class SearchAndInstallCourse(unittest.TestCase):
    #Setting up Test Suite (Selecting PhantomJS as driver, setting up base_url and implicit waits)
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(1)
        self.base_url = "http://localhost:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    #Search And Install Test Case
    def test_search_and_install_course(self):
        driver = self.driver
        driver.get("http://localhost:8000/")
        #Accessing Add Courses View
        driver.find_element_by_id("addCoursesButton").click()
        elemento = driver.find_element_by_css_selector(".blockUI")
        element = WebDriverWait(driver, 10).until((EC.staleness_of(elemento)))
        driver.find_element_by_id("searchcourses").clear()
        #Searching for Presentation Course
        driver.find_element_by_id("searchcourses").send_keys("presentation")
        #Pushing Return Key 
        driver.find_element_by_id("searchcourses").send_keys(Keys.RETURN);
        #Waiting for blockUI to hide
        elemento = driver.find_element_by_css_selector(".blockUI")
        element2 = WebDriverWait(driver, 10).until((EC.staleness_of(elemento)))
        driver.find_element_by_css_selector("#careertoinstall > h1.ui-li-heading").click()
        driver.find_element_by_id("confirmInstall").click()
        elemento = driver.find_element_by_css_selector(".blockUI")
        element2 = WebDriverWait(driver, 10).until((EC.staleness_of(elemento)))
        #Checking that Presentation Course is installed
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
