from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re

class TemporalActivity(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "file:///home/pedro/cultureplex/DrGlearning/gecko/www/index.html"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_temporal_activity(self):
        driver = self.driver
        driver.find_element_by_xpath("//div[@id='level']/header/a/span/span[2]").click()
        driver.find_element_by_xpath("(//a[@id='accesslevel']/h1)[2]").click()
        driver.find_element_by_css_selector("#accessactivity > h1.ui-li-heading").click()
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_css_selector("#after > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        try: self.assertRegexpMatches(driver.find_element_by_link_text("The Battle of New Orleans, which brought great pride to the Americans was fought before or after the Ghent Treaty was signed?✓ Your best score: 100").text, r"^The Battle of New Orleans, which brought great pride to the Americans was fought before or after the Ghent Treaty was signed[\s\S]✓ Your best score: 100$")
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
