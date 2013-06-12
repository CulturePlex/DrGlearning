from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re

class LinguisticActivity(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "file:///home/pedro/cultureplex/DrGlearning/gecko/www/index.html"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_linguistic_activity(self):
        driver = self.driver
        driver.find_element_by_xpath("(//a[@id='accessactivity']/h1)[2]").click()
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_id("inputLinguistic").clear()
        driver.find_element_by_id("inputLinguistic").send_keys("t")
        driver.find_element_by_css_selector("#tryLinguistic > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_id("inputLinguistic").click()
        driver.find_element_by_id("inputLinguistic").clear()
        driver.find_element_by_id("inputLinguistic").send_keys("e")
        driver.find_element_by_css_selector("#tryLinguistic > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_id("inputLinguistic").clear()
        driver.find_element_by_id("inputLinguistic").send_keys("c")
        driver.find_element_by_css_selector("#tryLinguistic > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_id("inputLinguistic").clear()
        driver.find_element_by_id("inputLinguistic").send_keys("s")
        driver.find_element_by_css_selector("#tryLinguistic > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_id("inputLinguistic").clear()
        driver.find_element_by_id("inputLinguistic").send_keys("m")
        driver.find_element_by_css_selector("#tryLinguistic > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_id("inputLinguistic").clear()
        driver.find_element_by_id("inputLinguistic").send_keys("u")
        driver.find_element_by_css_selector("#tryLinguistic > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_id("inputLinguistic").clear()
        driver.find_element_by_id("inputLinguistic").send_keys("h")
        driver.find_element_by_css_selector("#tryLinguistic > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all").click()
        driver.find_element_by_link_text("College ✓").click()
        try: self.assertRegexpMatches(driver.find_element_by_link_text("The Shawnee indians fought alongside the British, who was their leader?✓ Your best score: 88").text, r"^The Shawnee indians fought alongside the British, who was their leader[\s\S]✓ Your best score: 88$")
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
