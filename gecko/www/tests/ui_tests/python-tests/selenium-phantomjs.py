from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
from unittest import TestLoader, TextTestRunner, TestSuite
import time
import unittest
from change_settings import ChangeSettings
from exportImportUser import ExportImportUser
from search_and_install_course import SearchAndInstallCourse
from update_course import UpdateCourse

loader = TestLoader()
suite = TestSuite((
    loader.loadTestsFromTestCase(ChangeSettings),
    loader.loadTestsFromTestCase(ExportImportUser),
    loader.loadTestsFromTestCase(SearchAndInstallCourse),
    loader.loadTestsFromTestCase(ChangeSettings),
    loader.loadTestsFromTestCase(UpdateCourse),
))

runner = TextTestRunner(verbosity = 2)
runner.run(suite)
