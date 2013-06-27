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
from update_all_courses import UpdateAllCourses
from geospatial_activity import GeospatialActivity
from quiz_activity import QuizActivity
from visual_activity import VisualActivity
from temporal_activity import TemporalActivity
from linguistic_activity import LinguisticActivity
from relational_activity import RelationalActivity

loader = TestLoader()
suite = TestSuite((
    #loader.loadTestsFromTestCase(ChangeSettings),
    #loader.loadTestsFromTestCase(ExportImportUser),
    #loader.loadTestsFromTestCase(SearchAndInstallCourse),
    #loader.loadTestsFromTestCase(ChangeSettings),
    #loader.loadTestsFromTestCase(UpdateCourse),
    #loader.loadTestsFromTestCase(UpdateAllCourses),
    loader.loadTestsFromTestCase(GeospatialActivity),
    loader.loadTestsFromTestCase(QuizActivity),
    loader.loadTestsFromTestCase(VisualActivity),
    loader.loadTestsFromTestCase(LinguisticActivity),
    loader.loadTestsFromTestCase(RelationalActivity),
))

runner = TextTestRunner(verbosity = 2)
runner.run(suite)
