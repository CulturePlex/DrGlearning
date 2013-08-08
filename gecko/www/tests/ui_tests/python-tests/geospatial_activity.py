#!/usr/local/bin/python
# -*- coding: utf-8 -*-

#Geospatial Activity Python Test Case
import os, sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.common.keys import Keys

class GeospatialActivity(unittest.TestCase):
    #Setting up Test Suite (Selecting PhantomJS as driver, setting up base_url and implicit waits)
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(1)
        self.base_url = "http://localhost:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True
    #Geospatial Activity Test Case
    def test_geospatial_activity(self):
        driver = self.driver
        driver.get("http://localhost:8000/")
        driver.find_element_by_css_selector("h1.ui-li-heading").click()
        driver.find_element_by_css_selector("#accesslevel > h1.ui-li-heading").click()
        driver.find_element_by_css_selector("#accessactivity > h1.ui-li-heading").click()
        element2 = WebDriverWait(driver, 30).until((EC.element_to_be_clickable((By.ID, "dialogOK"))))
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        #Placing a marker throught JS Code
        driver.execute_script("var markerIcon = new google.maps.MarkerImage('resources/images/temp_marker.png'); Geospatial.marker = new google.maps.Marker({map: Geospatial.map,position: new google.maps.LatLng(47.44694705960048,0.703125 ),                     flat: true,                     clickable: false,                     icon: markerIcon                 });")
        driver.find_element_by_css_selector("#confirmGeospatial > span.ui-btn-inner.ui-btn-corner-all > span.ui-btn-text").click()
        driver.find_element_by_css_selector("#dialogOK > span.ui-btn-inner.ui-btn-corner-all").click()
        #Checking that activity is marked as success
        try: self.is_element_present(By.LINK_TEXT, "At the time of the war declaration, the British Empire was fighting another war. Where?✓ Your best score: 50")
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
