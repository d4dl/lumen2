<div class="centerDiv" xmlns="http://www.w3.org/1999/html">
<form action="<?php echo($action); ?>">
    <?php echo("<br/>" . "Today's Date: " . date("U")); ?>
    <h3>Enter a unique id for the school. </br>DO NOT use spaces.  Just characters and numbers.</h3>
    <table>
        <tr>
            <td>
                <label for="clientId">School ID:</label>
            </td>
            <td>
                <input type="text" name="clientId" id="clientId"/>
            </td>
        </tr>
    </table>
    </p>
    <input type="submit" value="Submit">
</form>

</div>