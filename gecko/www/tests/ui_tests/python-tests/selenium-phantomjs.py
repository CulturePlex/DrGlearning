from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
from unittest import TestLoader, TextTestRunner, TestSuite
import time
import unittest
from change_settings import ChangeSettings
from exportImportUser import ExportImportUser
from search_and_install_course import SearchAndInstallCourse

#suite = unittest.TestSuite()
#suite.addTest(change_settings)
#unittest.main(module=change_settings)
#unittest.main(module=exportImportUser)
#unittest.TextTestRunner().run(suite)

loader = TestLoader()
suite = TestSuite((
    loader.loadTestsFromTestCase(ChangeSettings),
    loader.loadTestsFromTestCase(ExportImportUser),
    loader.loadTestsFromTestCase(SearchAndInstallCourse),
))

runner = TextTestRunner(verbosity = 2)
runner.run(suite)
