<?php

namespace Drupal\Tests\assign_calc\Functional;

use Drupal\Core\Url;
use Drupal\Tests\BrowserTestBase;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;

/**
 * Simple test to ensure that main page loads with module enabled.
 *
 * @group assign_calc
 */
#[RunTestsInSeparateProcesses]
class LoadTest extends BrowserTestBase {

  /**
   * Modules to enable.
   *
   * @var array
   */
  protected static $modules = [
    'assign_calc',
    'paragraphs',
    'entity_reference_revisions',
    'node',
    'menu_ui',
    'views',
    'ds',
    'contact',
    'text',
    'datetime',
    'field',
    'path',
  ];

  /**
   * The theme to install as the default for testing.
   *
   * Defaults to the install profile's default theme, if it specifies any.
   *
   * @var string
   */
  protected $defaultTheme = 'stark';

  /**
   * A user with permission to administer site configuration.
   *
   * @var \Drupal\user\UserInterface
   */
  protected $user;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->user = $this->drupalCreateUser(['administer site configuration']);
    $this->drupalLogin($this->user);
  }

  /**
   * Tests that the home page loads with a 200 response.
   */
  public function testLoad() {
    $this->drupalGet(Url::fromRoute('<front>'));
    $this->assertSession()->statusCodeEquals(200);
  }

}
