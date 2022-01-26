<?php

namespace Drupal\assign_calc\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use \Drupal\Core\Url;

/**
 * Implements an assignment form.
 */
class AssignmentDatesForm extends FormBase {
  
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'assignment_form';
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    date_default_timezone_set('America/Los_Angeles');
    $date = date('Y-m-d');
    $form['date_start'] = [
      '#type' => 'date',
      '#default_value' => $date,
      '#title' => $this->t('Date you will begin the assignment:'),
    ];
    $form['date_due'] = [
      '#type' => 'date',
      '#title' => $this->t('Date the assignment is due:'),
    ];
		$prf = \Drupal::database()->getConnectionOptions()['prefix']['default'];	
		$node = $prf.'node';
		$node_field_data = $prf.'node_field_data';
    $conn = \Drupal\Core\Database\Database::getConnection();
    $result = $conn->query( /** @lang MySQL */
      "SELECT
   n.nid,
      ft.title
from
   $node n
       join $node_field_data ft on ft.nid=n.nid
where
     n.type='assignment'
order by n.nid
", array(':sep'=>'; '));
    if ($result) {
      $list = [];
      while ($row = $result->fetchAssoc()) {
        $list[$row['nid']] = $row['title'];
      }
    }
    $form['type_options'] = array(
      '#type' => 'value',
      '#value' => $list
    );
    $form['assignment_list'] = [
      '#type' => 'select',
      '#title' => $this
        ->t('Type of assignment:'),
      '#options' => $form['type_options']['#value'],
    ];
    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Calculate Schedule'),
      '#button_type' => 'primary',
      ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if ($form_state->getValue('date_due') <= $form_state->getValue('date_start')) {
      $form_state->setErrorByName('date_due', $this->t('The Due date must be more than Start date.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    //$this->messenger()->addStatus($this->t('Your schedule is from @number1 to @number2', ['@number1' => $form_state->getValue('date_start'), '@number2' => $form_state->getValue('date_due')]));
    $params['query'] = [
'start_date' => $form_state->getValue('date_start'),
'due_date' => $form_state->getValue('date_due')
    ];
    $assign = $form_state->getValue('assignment_list');
   // echo ("Asd");
    $form_state->setRedirectUrl(Url::fromUri('internal:' . '/node/'.$assign, $params));
  }
}
