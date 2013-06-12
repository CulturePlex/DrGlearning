from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re

class GeospatialActivity(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "file:///home/pedro/cultureplex/DrGlearning/gecko/www/index.html"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_geospatial_activity(self):
        driver = self.driver
        driver.find_element_by_css_selector("h1.ui-li-heading").click()
        driver.find_element_by_css_selector("#accesslevel > h1.ui-li-heading").click()
        driver.find_element_by_css_selector("#accessactivity > h1.ui-li-heading").click()
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length != 0 | 30000]]
        # ERROR: Caught exception [ERROR: Unsupported command [waitForCondition | selenium.browserbot.getCurrentWindow().$(".blockUI").length == 0 | 30000]]
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        # ERROR: Caught exception [ERROR: Unsupported command [runScript | var markerIcon = new google.maps.MarkerImage('resources/images/temp_marker.png'); Geospatial.marker = new google.maps.Marker({map: Geospatial.map,position: new google.maps.LatLng(47.44694705960048,0.703125 ),                     flat: true,                     clickable: false,                     icon: markerIcon                 }); | ]]
        driver.find_element_by_css_selector("#confirmGeospatial > span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all").click()
        for i in range(60):
            try:
                if self.is_element_present(By.LINK_TEXT, "At the time of the war declaration, the British Empire was fighting another war. Where?✓ Your best score: 50"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
    
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
